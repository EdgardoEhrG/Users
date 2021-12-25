import { IsEmail, IsString } from "class-validator";

export class UserLoginDto {
  @IsEmail({}, { message: "Wrong email" })
  email: string;

  @IsString({ message: "Wrong password" })
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
