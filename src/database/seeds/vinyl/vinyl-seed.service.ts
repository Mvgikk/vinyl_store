import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from '../../../vinyl/entities/vinyl.entity';

@Injectable()
export class VinylSeedService {
    constructor(
        @InjectRepository(Vinyl)
        private readonly vinylRepository: Repository<Vinyl>
    ) {}

    async run() {
        const vinyls = [
            {
                name: 'Abbey Road',
                author: 'The Beatles',
                description: 'Classic Beatles album',
                price: 29.99,
            },
            {
                name: 'Dark Side of the Moon',
                author: 'Pink Floyd',
                description: 'Legendary album by Pink Floyd',
                price: 34.99,
            },
            {
                name: 'Hotel California',
                author: 'Eagles',
                description: 'A masterpiece by the Eagles',
                price: 27.99,
            },
            {
                name: 'Back in Black',
                author: 'AC/DC',
                description: 'Classic rock album by AC/DC',
                price: 31.99,
            },
            {
                name: 'Rumors',
                author: 'Fleetwood Mac',
                description: 'Iconic Fleetwood Mac album',
                price: 26.99,
            },
            {
                name: 'Thriller',
                author: 'Michael Jackson',
                description: 'Best-selling album of all time',
                price: 33.99,
            },
            {
                name: 'Led Zeppelin IV',
                author: 'Led Zeppelin',
                description: 'Legendary rock album',
                price: 28.99,
            },
            {
                name: 'A Night at the Opera',
                author: 'Queen',
                description: 'Queens iconic album',
                price: 30.99,
            },
            {
                name: 'The Wall',
                author: 'Pink Floyd',
                description: 'Concept album by Pink Floyd',
                price: 35.99,
            },
            {
                name: 'Highway 61 Revisited',
                author: 'Bob Dylan',
                description: 'Dylans influential album',
                price: 25.99,
            },
            {
                name: 'Born to Run',
                author: 'Bruce Springsteen',
                description: 'Springsteens classic',
                price: 28.99,
            },
            {
                name: 'Purple Rain',
                author: 'Prince',
                description: 'Princes landmark album',
                price: 29.99,
            },
            {
                name: 'The Beatles (White Album)',
                author: 'The Beatles',
                description: 'The Beatles self-titled album',
                price: 32.99,
            },
            {
                name: 'Appetite for Destruction',
                author: 'Guns N Roses',
                description: 'Hard rock masterpiece',
                price: 27.99,
            },
            {
                name: 'Goodbye Yellow Brick Road',
                author: 'Elton John',
                description: 'Elton Johns classic',
                price: 29.99,
            },
            {
                name: 'Tapestry',
                author: 'Carole King',
                description: 'Best-selling album by Carole King',
                price: 26.99,
            },
            {
                name: 'Nevermind',
                author: 'Nirvana',
                description: 'Grunge revolution by Nirvana',
                price: 31.99,
            },
            {
                name: 'Sticky Fingers',
                author: 'The Rolling Stones',
                description: 'Iconic Stones album',
                price: 27.99,
            },
            {
                name: 'Kind of Blue',
                author: 'Miles Davis',
                description: 'Jazz masterpiece',
                price: 28.99,
            },
            {
                name: 'The Joshua Tree',
                author: 'U2',
                description: 'U2s iconic album',
                price: 30.99,
            },
            {
                name: 'Pet Sounds',
                author: 'The Beach Boys',
                description: 'Influential album by The Beach Boys',
                price: 27.99,
            },
            {
                name: 'Graceland',
                author: 'Paul Simon',
                description: 'Award-winning album',
                price: 29.99,
            },
            {
                name: 'Rage Against the Machine',
                author: 'Rage Against the Machine',
                description: 'Political rock album',
                price: 31.99,
            },
            {
                name: 'Houses of the Holy',
                author: 'Led Zeppelin',
                description: 'Classic Zeppelin album',
                price: 26.99,
            },
            {
                name: 'The Velvet Underground & Nico',
                author: 'The Velvet Underground',
                description: 'Seminal rock album',
                price: 29.99,
            },
            {
                name: 'Rumors',
                author: 'Fleetwood Mac',
                description: 'A rock classic by Fleetwood Mac',
                price: 28.99,
            },
            {
                name: 'Blonde on Blonde',
                author: 'Bob Dylan',
                description: 'Dylans double album',
                price: 27.99,
            },
            {
                name: 'Beggars Banquet',
                author: 'The Rolling Stones',
                description: 'Stones album from the 60s',
                price: 25.99,
            },
            {
                name: 'Blue',
                author: 'Joni Mitchell',
                description: 'Joni Mitchells best work',
                price: 26.99,
            },
            {
                name: 'London Calling',
                author: 'The Clash',
                description: 'Punk rock classic',
                price: 29.99,
            },
            {
                name: 'OK Computer',
                author: 'Radiohead',
                description: 'Critically acclaimed album',
                price: 32.99,
            },
            {
                name: 'Songs in the Key of Life',
                author: 'Stevie Wonder',
                description: 'Masterpiece by Stevie Wonder',
                price: 30.99,
            },
            {
                name: 'The Rise and Fall of Ziggy Stardust',
                author: 'David Bowie',
                description: 'Bowies alter ego',
                price: 28.99,
            },
            {
                name: 'Whos Next',
                author: 'The Who',
                description: 'Classic album by The Who',
                price: 27.99,
            },
            {
                name: 'Paranoid',
                author: 'Black Sabbath',
                description: 'Heavy metal classic',
                price: 28.99,
            },
            {
                name: 'Bridge Over Troubled Water',
                author: 'Simon & Garfunkel',
                description: 'Popular album by Simon & Garfunkel',
                price: 26.99,
            },
            {
                name: 'Aja',
                author: 'Steely Dan',
                description: 'Jazz-rock classic',
                price: 30.99,
            },
            {
                name: 'Led Zeppelin II',
                author: 'Led Zeppelin',
                description: 'Hard rock masterpiece',
                price: 29.99,
            },
            {
                name: 'Abbey Road',
                author: 'The Beatles',
                description: 'Another iconic album by The Beatles',
                price: 33.99,
            },
            {
                name: 'Revolver',
                author: 'The Beatles',
                description: 'One of The Beatles best',
                price: 29.99,
            },
            {
                name: 'Doolittle',
                author: 'Pixies',
                description: 'Influential alternative album',
                price: 28.99,
            },
            {
                name: 'Ten',
                author: 'Pearl Jam',
                description: 'Breakthrough album for Pearl Jam',
                price: 27.99,
            },
            {
                name: 'Electric Ladyland',
                author: 'Jimi Hendrix',
                description: 'Innovative guitar album',
                price: 32.99,
            },
            {
                name: 'Physical Graffiti',
                author: 'Led Zeppelin',
                description: 'Epic double album',
                price: 35.99,
            },
            {
                name: 'Born in the U.S.A.',
                author: 'Bruce Springsteen',
                description: 'Springsteens hit album',
                price: 28.99,
            },
            {
                name: 'Blood on the Tracks',
                author: 'Bob Dylan',
                description: 'Personal album by Dylan',
                price: 27.99,
            },
            {
                name: 'Metallica',
                author: 'Metallica',
                description: 'Self-titled Black Album',
                price: 31.99,
            },
            {
                name: 'After the Gold Rush',
                author: 'Neil Young',
                description: 'Neil Youngs best',
                price: 26.99,
            },
            {
                name: 'American Idiot',
                author: 'Green Day',
                description: 'Political punk album',
                price: 29.99,
            },
            {
                name: 'Wish You Were Here',
                author: 'Pink Floyd',
                description: 'Touching album by Pink Floyd',
                price: 33.99,
            },
        ];

        await this.vinylRepository.save(vinyls);
        console.log('Vinyl records seeded successfully!');
    }

    async clear() {
        await this.vinylRepository.query('TRUNCATE TABLE "vinyl" CASCADE');
        console.log('Vinyl records cleared successfully!');
    }
}
