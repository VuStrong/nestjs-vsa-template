import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export default class RefreshToken {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    token: string;

    @Column()
    expiryTime: Date;
}
