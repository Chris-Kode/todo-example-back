import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTaskDto } from './DTOs/create.dto';
import { UpdateTaskDto } from './DTOs/update.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create')
  create(@Body() body: CreateTaskDto) {
    return this.appService.create(body);
  }

  @Get('/tasks')
  getTasks() {
    return this.appService.getTasks();
  }

  @Get('/tasks/:id')
  getTaskById(@Param('id') id: number) {
    return this.appService.getTaskById(id);
  }

  @Put('/tasks/:id')
  updateTaskById(@Param('id') id: number, @Body() body: UpdateTaskDto) {
    return this.appService.updateTaskById(id, body);
  }

  @Delete('/tasks/:id')
  deleteTaskById(@Param('id') id: number) {
    return this.appService.deleteTaskById(id);
  }
}
