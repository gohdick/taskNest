import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { ListTasksQueryDto } from './dto/list-tasks.query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  list(@Query() query: ListTasksQueryDto) {
    return this.tasksService.list(query);
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.softDelete(id);
    return { deleted: true };
  }
}
