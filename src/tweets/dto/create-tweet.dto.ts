import { ApiProperty } from '@nestjs/swagger';

export class CreateTweetDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  public: boolean;
  @ApiProperty()
  image?: string;
}
