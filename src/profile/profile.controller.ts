import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { interestsDto, profileUpdateDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/profile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getProfile(res: Response) {
    return this.profile.getAll();
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return this.profile.getByEmail(id);
  }

  @Post()
  async createProfile() {
    return 'create';
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() profileUpdate: profileUpdateDto,
  ) {
    if (
      profileUpdate.heightUnit !== 'cm' &&
      profileUpdate.heightUnit !== 'in'
    ) {
      let response = {
        Mesage: 'Pelase insert cm / in',
        Status: 400,
      };

      return response;
    }
    return this.profile.update(id, profileUpdate);
  }

  @Delete(':id')
  async deleteProfile(@Param('id') id: string) {
    return this.profile.deleteProfile(id);
  }

  @Post('interest/:id')
  async insertInterest(
    @Param('id') id: string,
    @Body() interests: interestsDto,
  ) {
    return this.profile.updateInterest(id, interests.interets);
  }

  @Delete('interest/:id')
  async deleteInterest(
    @Param('id') id: string,
    @Body() interests: interestsDto,
  ) {
    return this.profile.updateInterest(id, interests.interets, true);
  }

  @Put('upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          let filename = `${Math.round(Math.random() * 1e9)}${extname(
            file.originalname,
          )}`;
          callback(null, filename);
        },
      }),
    }),
  )
  // @UseInterceptors(FileInterceptor('file'))
  async uploadeFile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    let fileUrl: string = `${req.protocol}://${req.get('host')}/uploads/${
      file.filename
    }`;
    return this.profile.updatePicture(id, file,fileUrl);
    
  }
}
