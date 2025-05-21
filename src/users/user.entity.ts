import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  hobbie: string;

  @Column()
  gender: string;

  @Column()
  roles: string[];

}