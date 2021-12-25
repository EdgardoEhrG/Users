import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
  @IsEmail({}, { message: "Wrong email" })
  email: string;

  @IsString({ message: "Wrong password" })
  password: string;

  @IsString({ message: "The name is empty" })
  name: string;

  constructor(email: string, password: string, name: string) {
    this.email = email;
    this.password = password;
    this.name = name;
  }
}
