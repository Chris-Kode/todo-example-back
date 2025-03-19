import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { CreateTaskDto } from './DTOs/create.dto';
import { TaskDto } from './DTOs/task.dto';
import { UpdateTaskDto } from './DTOs/update.dto';
import { NotFoundException } from '@nestjs/common';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('create', () => {
    it('should create a new task with the provided data', () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const task = service.create(createTaskDto);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe(createTaskDto.title);
      expect(task.description).toBe(createTaskDto.description);
      expect(task.completed).toBe(false);
    });

    it('should increment the id for each new task', () => {
      const task1 = service.create({
        title: 'Task 1',
        description: 'Description 1',
      });

      const task2 = service.create({
        title: 'Task 2',
        description: 'Description 2',
      });

      expect(task2.id).toBe(task1.id + 1);
    });
  });

  describe('getTasks', () => {
    it('should return an empty array when no tasks exist', () => {
      const tasks = service.getTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all created tasks', () => {
      service.create({
        title: 'Task 1',
        description: 'Description 1',
      });

      service.create({
        title: 'Task 2',
        description: 'Description 2',
      });

      const tasks = service.getTasks();

      expect(tasks.length).toBe(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
    });
  });

  describe('getTaskById', () => {
    it('should return a task with the matching id', () => {
      const createdTask = service.create({
        title: 'Test Task',
        description: 'Test Description',
      });

      const foundTask = service.getTaskById(createdTask.id);

      expect(foundTask).toEqual(createdTask);
    });

    it('should throw NotFoundException when task with given id does not exist', () => {
      expect(() => service.getTaskById(999)).toThrow(NotFoundException);
      expect(() => service.getTaskById(999)).toThrow(
        'Task with ID 999 not found',
      );
    });
  });

  describe('updateTaskById', () => {
    it('should update a task with the provided data', () => {
      const createdTask = service.create({
        title: 'Original Title',
        description: 'Original Description',
      });

      const updateData: UpdateTaskDto = {
        title: 'Updated Title',
        completed: true,
      };

      const updatedTask = service.updateTaskById(createdTask.id, updateData);

      expect(updatedTask.id).toBe(createdTask.id);
      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.description).toBe(createdTask.description); // Should remain unchanged
      expect(updatedTask.completed).toBe(updateData.completed);
    });

    it('should throw NotFoundException when updating a non-existent task', () => {
      const updateData: UpdateTaskDto = {
        title: 'Updated Title',
      };

      expect(() => service.updateTaskById(999, updateData)).toThrow(
        NotFoundException,
      );
      expect(() => service.updateTaskById(999, updateData)).toThrow(
        'Task with ID 999 not found',
      );
    });
  });

  describe('deleteTaskById', () => {
    it('should delete a task and return success message', () => {
      const createdTask = service.create({
        title: 'Task to Delete',
        description: 'This task will be deleted',
      });

      const result = service.deleteTaskById(createdTask.id);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        `Task with ID ${createdTask.id} deleted successfully`,
      );

      // Verify task was actually deleted
      expect(() => service.getTaskById(createdTask.id)).toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when deleting a non-existent task', () => {
      expect(() => service.deleteTaskById(999)).toThrow(NotFoundException);
      expect(() => service.deleteTaskById(999)).toThrow(
        'Task with ID 999 not found',
      );
    });
  });
});
