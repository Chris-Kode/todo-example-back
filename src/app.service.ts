import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './DTOs/create.dto';
import { TaskDto } from './DTOs/task.dto';
import { UpdateTaskDto } from './DTOs/update.dto';

@Injectable()
export class AppService {
  // we create a private property to store the tasks
  private tasks: TaskDto[] = [];
  private id = 0;

  public create(body: CreateTaskDto): TaskDto {
    const task: TaskDto = {
      id: this.id++,
      ...body,
      completed: false,
    };

    this.tasks.push(task);
    return task;
  }

  public getTasks(): TaskDto[] {
    return this.tasks;
  }

  public getTaskById(id: number): TaskDto {
    const task = this.tasks.find((task) => task.id === +id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  public updateTaskById(id: number, updateData: UpdateTaskDto): TaskDto {
    const taskIndex = this.tasks.findIndex((task) => task.id === +id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updateData,
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  public deleteTaskById(id: number): { success: boolean; message: string } {
    const taskIndex = this.tasks.findIndex((task) => task.id === +id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    this.tasks.splice(taskIndex, 1);
    return {
      success: true,
      message: `Task with ID ${id} deleted successfully`,
    };
  }
}
