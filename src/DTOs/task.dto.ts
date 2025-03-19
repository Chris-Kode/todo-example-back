import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class TaskDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  completed: boolean;
}
