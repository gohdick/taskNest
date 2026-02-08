import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks.query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepo: Repository<TaskEntity>,
  ) {}

  private toResponse(task: TaskEntity) {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      status: task.status,
      created_at: task.created_at.toISOString(),
      updated_at: task.updated_at.toISOString(),
    };
  }

  async list(query: ListTasksQueryDto) {
    const where = query.status ? { status: query.status } : {};
    const tasks = await this.tasksRepo.find({
      where,
      order: {
        updated_at: 'DESC',
      },
    });

    return tasks.map((t) => this.toResponse(t));
  }

  async create(dto: CreateTaskDto) {
    const task = this.tasksRepo.create({
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status ?? TaskStatus.TODO,
    });

    const saved = await this.tasksRepo.save(task);
    return this.toResponse(saved);
  }

  async update(id: number, dto: UpdateTaskDto) {
    const existing = await this.tasksRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    if (dto.title !== undefined) existing.title = dto.title;
    if (dto.description !== undefined) existing.description = dto.description;
    if (dto.status !== undefined) existing.status = dto.status;

    const saved = await this.tasksRepo.save(existing);
    return this.toResponse(saved);
  }

  async softDelete(id: number) {
    const result = await this.tasksRepo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
