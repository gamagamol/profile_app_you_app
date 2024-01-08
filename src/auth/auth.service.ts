import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private Prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(login: LoginDto) {
    const user = await this.Prisma.user.findFirst({
      where: {
        email: login.email,
      },
    });
    

    if (!user) {
      return {
        status: 'fail',
        message: 'username or password is wrong',
        code: 403,
      };
    }

    const isMatch = await bcrypt.compare(login.password, user.password);

    if (!isMatch) {
      return {
        status: 'fail',
        message: 'username or password is wrong',
        code: 403,
      };
    }

    const payload = { sub: user.id, username: user.ussername };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(rgs: RegisterDto) {
    // const hash = await argon.hash(rgs.password);
    const hash = await bcrypt.hash(rgs.password, 10);
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    try {
      // check email are duplicat

      const email = await this.Prisma.user.findFirst({
        where: {
          email: rgs.email,
          deleted: false,
        },
      });

      if (email != null) {
        return {
          Message: 'Email Duplicat',
          StatusCode: 500,
        };
      }

      const user = await this.Prisma.user.create({
        data: {
          ussername: rgs.username,
          email: rgs.email,
          password: hash,
          createdAt: new Date(formattedDate).toISOString(),
        },
      });

      return {
        Message: 'success',
        StatusCode: 201,
        payload: user,
      };
    } catch (err) {
      console.log(err);

      return {
        Message: err,
        StatusCode: 500,
      };
    }
  }
}
