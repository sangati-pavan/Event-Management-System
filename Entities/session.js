const { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } = require('typeorm');
const { Event } = require('./Event');

@Entity()
class Session {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    title;

    @Column()
    speaker;

    @ManyToOne(() => Event, event => event.sessions)
    event;
}

module.exports = { Session };
