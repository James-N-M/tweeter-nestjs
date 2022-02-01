import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {

  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto) {
    const newBookmark: Bookmark = await this.bookmarksRepository.create(createBookmarkDto);

    await this.bookmarksRepository.save(newBookmark);

    return newBookmark;
  }

  findAll() {
    return `This action returns all bookmarks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookmark`;
  }

  update(id: number, updateBookmarkDto: UpdateBookmarkDto) {
    return `This action updates a #${id} bookmark`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookmark`;
  }
}
