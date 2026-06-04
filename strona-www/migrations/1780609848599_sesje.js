/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    // 1. Stworzenie tabeli sesji (tokenów)
    pgm.createTable('sessions', {
        id: { 
            type: 'uuid', 
            primaryKey: true, 
            default: pgm.func('gen_random_uuid()') // Korzysta z włączonego już pgcrypto
        },
        user_id: {
            type: 'integer', // Zmienione na integer, bo Twój users.id to 'serial'
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE'
        },
        token: {
            type: 'varchar(255)',
            notNull: true,
            unique: true
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        expires_at: {
            type: 'timestamp',
            notNull: true
        }
    });

    // 2. Dodanie indeksów dla optymalizacji szybkości działania hooka
    pgm.createIndex('sessions', 'token');
    pgm.createIndex('sessions', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Usunięcie tabeli (indeksy zostaną usunięte automatycznie razem z tabelą)
    pgm.dropTable('sessions', { ifExists: true });
};