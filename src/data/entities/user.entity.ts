import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export default class User {
    @PrimaryGeneratedColumn()
    numericId: number;

    @Column({ unique: true })
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true, type: 'varchar' })
    hashedPassword: string | null;

    @Column({ default: false })
    emailConfirmed: boolean;

    @Column({ type: 'varchar', default: null })
    emailConfirmationToken: string | null;

    @Column({ type: 'datetime', default: null })
    emailConfirmationTokenExpiryTime: Date | null;

    @Column({ type: 'varchar', default: null })
    passwordResetToken: string | null;

    @Column({ type: 'datetime', default: null })
    passwordResetTokenExpiryTime: Date | null;

    @Column({ type: 'datetime', default: null })
    lockoutEnd: Date | null;

    public isLocked(): boolean {
        return this.lockoutEnd !== null && this.lockoutEnd > new Date();
    }
}
