import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateTaskDto } from './DTOs/create.dto';
import { TaskDto } from './DTOs/task.dto';
import { UpdateTaskDto } from './DTOs/update.dto';
import { NotFoundException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('create', () => {
    it('should create a new task', () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };
      const result: TaskDto = {
        id: 0,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      };

      jest.spyOn(appService, 'create').mockImplementation(() => result);

      expect(appController.create(createTaskDto)).toEqual(result);
      expect(appService.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('getTasks', () => {
    it('should return an array of tasks', () => {
      const result: TaskDto[] = [
        {
          id: 0,
          title: 'Test Task',
          description: 'Test Description',
          completed: false,
        },
      ];

      jest.spyOn(appService, 'getTasks').mockImplementation(() => result);

      expect(appController.getTasks()).toEqual(result);
      expect(appService.getTasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should return a single task by id', () => {
      const result: TaskDto = {
        id: 0,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      };

      jest.spyOn(appService, 'getTaskById').mockImplementation(() => result);

      expect(appController.getTaskById(0)).toEqual(result);
      expect(appService.getTaskById).toHaveBeenCalledWith(0);
    });
  });

  describe('updateTaskById', () => {
    it('should update a task', () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        completed: true,
      };

      const result: TaskDto = {
        id: 0,
        title: 'Updated Task',
        description: 'Test Description',
        completed: true,
      };

      jest.spyOn(appService, 'updateTaskById').mockImplementation(() => result);

      expect(appController.updateTaskById(0, updateTaskDto)).toEqual(result);
      expect(appService.updateTaskById).toHaveBeenCalledWith(0, updateTaskDto);
    });
  });

  describe('deleteTaskById', () => {
    it('should delete a task', () => {
      const result = {
        success: true,
        message: 'Task with ID 0 deleted successfully',
      };

      jest.spyOn(appService, 'deleteTaskById').mockImplementation(() => result);

      expect(appController.deleteTaskById(0)).toEqual(result);
      expect(appService.deleteTaskById).toHaveBeenCalledWith(0);
    });
  });
});
