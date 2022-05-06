import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  tweetId: number;
  @ApiProperty()
  image?: string;
}
