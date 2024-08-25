const { Entity, PrimaryGeneratedColumn, Column, ManyToOne } = require('typeorm');
const { Event } = require('./Event');

@Entity()
class Participant {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @Column()
    email;

    @ManyToOne(() => Event, event => event.participants)
    event;
}

module.exports = { Participant };
