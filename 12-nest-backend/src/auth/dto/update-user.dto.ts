import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

//* Usamos la clase PartialType indicando que todos los campos son opcionales
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsEmail()
    email: string;
    @IsString()
    name: string;
    @MinLength(6)
    password: string;
}
