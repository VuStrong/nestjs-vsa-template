import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1761490643409 implements MigrationInterface {
    name = 'CreateDb1761490643409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`numericId\` int NOT NULL AUTO_INCREMENT, \`id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`hashedPassword\` varchar(255) NULL, \`emailConfirmed\` tinyint NOT NULL DEFAULT 0, \`emailConfirmationToken\` varchar(255) NULL, \`emailConfirmationTokenExpiryTime\` datetime NULL, \`passwordResetToken\` varchar(255) NULL, \`passwordResetTokenExpiryTime\` datetime NULL, \`lockoutEnd\` datetime NULL, UNIQUE INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`numericId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`userId\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`expiryTime\` datetime NOT NULL, PRIMARY KEY (\`userId\`, \`token\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
