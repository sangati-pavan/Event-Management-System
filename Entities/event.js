const { Entity, PrimaryGeneratedColumn, Column, OneToMany } = require('typeorm');
const { Session } = require('./Session');
const { Participant } = require('./Participant');

@Entity()
class Event {
    @PrimaryGeneratedColumn()
    id;

    @Column()
    name;

    @Column()
    description;

    @Column()
    date;

    @OneToMany(() => Session, session => session.event)
    sessions;

    @OneToMany(() => Participant, participant => participant.event)
    participants;
}

module.exports = { Event };
