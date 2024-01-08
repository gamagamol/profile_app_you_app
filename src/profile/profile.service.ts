import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  horoscopeDto,
  profileResponse,
  profileUpdateDto,
  ZodiacSign,
} from './dto/profile.dto';
@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    try {
      const user = await this.prisma.user.findMany({
        where: {
          deleted: false,
        },
      });
      const response: profileResponse = {
        Message: 'success',
        Status: 200,
        Payload: user,
      };

      return response;
    } catch (error) {
      console.log(error);

      const response: profileResponse = {
        Message: error,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }

  async getByEmail(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      const response: profileResponse = {
        Message: 'success',
        Status: 200,
        Payload: user,
      };

      return response;
    } catch (error) {
      const response: profileResponse = {
        Message: error,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }

  async update(id: string, profile: profileUpdateDto) {
    try {
      let birthday = profile.birthday.split('-');
      let horoscopeDto = this.getHoroscope(
        parseInt(birthday[1]),
        parseInt(birthday[2]),
      );
      let zodiac = this.getZodiacSign(
        parseInt(birthday[0]),
        parseInt(birthday[1]),
        parseInt(birthday[2]),
      );
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

      // convert inches to cm
      if (profile.heightUnit == 'in') {
        profile.height = profile.height * 2.54;
      }

      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: profile.name,
          gender: profile.gender,
          Height: profile.height,
          heightUnit: profile.heightUnit,
          weight: profile.weight,
          birthday: profile.birthday,
          horoscope: horoscopeDto.horoscope,
          zodiac: zodiac,
          updatedAt: new Date(formattedDate).toISOString(),
        },
      });

      const response: profileResponse = {
        Message: 'success',
        Status: 200,
        Payload: user,
      };
      return response;
    } catch (err) {
      const response: profileResponse = {
        Message: err,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }

  getHoroscope(month: number, day: number): horoscopeDto {
    let horoscope: horoscopeDto;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      horoscope = {
        horoscope: 'Aries',
        err: false,
      };
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      horoscope = {
        horoscope: 'Taurus',
        err: false,
      };
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
      horoscope = {
        horoscope: 'Gemini',
        err: false,
      };
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
      horoscope = {
        horoscope: 'Cancer (Crab)',
        err: false,
      };
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      horoscope = {
        horoscope: 'Leo',
        err: false,
      };
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      horoscope = {
        horoscope: 'Virgo',
        err: false,
      };
    }
    // Sisanya ikuti pola yang sama untuk zodiak lainnya

    // Tanggal lahir tidak valid
    if (!horoscope) {
      horoscope = {
        horoscope: 'Tanggal lahir tidak valid.',
        err: true,
      };
    }

    return horoscope;
  }

  getZodiacSign(year: number, month: number, day: number): string {
    const birthDate = new Date(year, month - 1, day);

    const zodiacSigns: ZodiacSign[] = [
      {
        start: new Date(2023, 0, 22),
        end: new Date(2024, 1, 9),
        sign: 'Rabbit',
      },
      {
        start: new Date(2022, 1, 1),
        end: new Date(2023, 0, 21),
        sign: 'Tiger',
      },
      { start: new Date(2021, 1, 12), end: new Date(2022, 0, 31), sign: 'Ox' },
      { start: new Date(2020, 0, 25), end: new Date(2021, 1, 11), sign: 'Rat' },
      { start: new Date(2019, 1, 5), end: new Date(2020, 0, 24), sign: 'Pig' },
      { start: new Date(2018, 1, 16), end: new Date(2019, 1, 4), sign: 'Dog' },
      {
        start: new Date(2017, 0, 28),
        end: new Date(2018, 1, 15),
        sign: 'Rooster',
      },
      {
        start: new Date(2016, 1, 8),
        end: new Date(2017, 0, 27),
        sign: 'Monkey',
      },
      { start: new Date(2015, 1, 19), end: new Date(2016, 1, 7), sign: 'Goat' },
      {
        start: new Date(2014, 0, 31),
        end: new Date(2015, 1, 18),
        sign: 'Horse',
      },
      {
        start: new Date(2013, 1, 10),
        end: new Date(2014, 0, 30),
        sign: 'Snake',
      },
      {
        start: new Date(2012, 0, 23),
        end: new Date(2013, 1, 9),
        sign: 'Dragon',
      },
      {
        start: new Date(2011, 1, 3),
        end: new Date(2012, 0, 22),
        sign: 'Rabbit',
      },
      {
        start: new Date(2010, 1, 14),
        end: new Date(2011, 1, 2),
        sign: 'Tiger',
      },
      { start: new Date(2009, 0, 26), end: new Date(2010, 1, 13), sign: 'Ox' },
      { start: new Date(2008, 1, 7), end: new Date(2009, 0, 25), sign: 'Rat' },
      { start: new Date(2007, 1, 18), end: new Date(2008, 1, 6), sign: 'Boar' },
      { start: new Date(2006, 0, 29), end: new Date(2007, 1, 17), sign: 'Dog' },
      {
        start: new Date(2005, 1, 9),
        end: new Date(2006, 0, 28),
        sign: 'Rooster',
      },
      {
        start: new Date(2004, 0, 22),
        end: new Date(2005, 1, 8),
        sign: 'Monkey',
      },
      { start: new Date(2003, 1, 1), end: new Date(2004, 0, 21), sign: 'Goat' },
      {
        start: new Date(2002, 1, 12),
        end: new Date(2003, 0, 31),
        sign: 'Horse',
      },
      {
        start: new Date(2001, 0, 24),
        end: new Date(2002, 1, 11),
        sign: 'Snake',
      },
    ];
    const selectedSign = zodiacSigns.find(
      (sign) => birthDate >= sign.start && birthDate <= sign.end,
    );

    return selectedSign ? selectedSign.sign : 'Zodiak tidak ditemukan';
  }

  async deleteProfile(id: string) {
    try {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(formattedDate).toISOString(),
          deleted: true,
        },
      });

      const response: profileResponse = {
        Message: 'Success',
        Status: 200,
        Payload: user,
      };
      return response;
    } catch (err) {
      const response: profileResponse = {
        Message: err,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }

  async updateInterest(
    id: string,
    interest: string,
    is_delete: boolean = false,
  ) {
    try {
      let interests = await this.getInterestByid(id);
      let old_interest = await interests.Payload;
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

      // check length interest exist
      if (!is_delete) {
        old_interest.interests.push(interest);
      } else {
        if (old_interest.interests.length > 0) {
          old_interest.interests = old_interest.interests.filter(
            (item: string) => item !== interest,
          );
        }
      }

      const usr = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          updatedAt: new Date(formattedDate).toISOString(),
          interests: old_interest.interests,
        },
      });

      // console.log(usr);

      const response: profileResponse = {
        Message: 'success',
        Status: 200,
        Payload: usr,
      };
      console.log(response);

      return response;
    } catch (error) {
      const response: profileResponse = {
        Message: error,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }

  async getInterestByid(id_user: string) {
    try {
      const interest = this.prisma.user.findFirst({
        select: {
          interests: true,
        },
        where: {
          id: id_user,
        },
      });
      const response: profileResponse = {
        Message: 'success',
        Status: 200,
        Payload: interest,
      };
      return response;
    } catch (error) {
      const response: profileResponse = {
        Message: error,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }

  async updatePicture(id: string, file: Express.Multer.File, fileUrl: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          img_hash: file.filename,
          img_name: file.originalname,
        },
      });

      user.img_name = fileUrl;

      const response: profileResponse = {
        Message: 'success',
        Status: 200,
        Payload: user,
      };
      return response;
    } catch (err) {
      const response: profileResponse = {
        Message: err,
        Status: 500,
        Payload: [],
      };
      return response;
    }
  }
}
