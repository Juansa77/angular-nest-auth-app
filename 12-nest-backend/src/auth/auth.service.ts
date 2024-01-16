import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { RegisterUserDto, CreateUserDto, UpdateUserDto, LoginDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) {}

  //* ---CREATE USER------

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      await newUser.save();
      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }
  //* ---REGISTER TOKEN------

  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto);

    return {
      user: user,
      token: this.getJwtToken({ id: user._id }),
    };
  }

  //* ---LOGIN------
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Not valid credentials - email');
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password: _, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  //* ---FIND USER BY ID------

  async findUserById(id: string) {
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  //* ---FIND ONE USER------

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  //* ---UPDATE USER------

  async update(id: string, updateAuthDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Actualizar solo los campos que se proporcionan en el DTO
      Object.assign(user, updateAuthDto);

      // Guardar el usuario actualizado en la base de datos
      const updatedUser = await user.save();

      // Devolver el usuario actualizado sin la contraseña
      const { password, ...rest } = updatedUser.toJSON();
      return rest;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }

  //* ---DELETE USER------

  async remove(id: string) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await user.deleteOne();
      return 'User deleted';
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
