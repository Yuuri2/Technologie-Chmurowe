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
    // 1. Usuwamy stare tabele (najpierw lists, bo zależy od products)
    pgm.dropTable('lists', { ifExists: true });
    pgm.dropTable('products', { ifExists: true });

    // 2. Tworzymy nową tabelę 'lista'
    pgm.createTable('lista', {
        id: { type: 'serial', primaryKey: true },
        user_id: { 
            type: 'integer', 
            notNull: true,
            references: '"users"', // Odniesienie do istniejącej tabeli users
            onDelete: 'CASCADE'    // Jeśli usuniemy usera, jego listy też znikną
        },
        nazwa: { type: 'varchar', notNull: true }
    });

    // 3. Tworzymy nową tabelę 'product'
    pgm.createTable('product', {
        id: { type: 'serial', primaryKey: true },
        list_id: { 
            type: 'integer', 
            notNull: true,
            references: '"lista"', // Produkt musi należeć do konkretnej listy
            onDelete: 'CASCADE'    // Jeśli usuniemy listę, jej produkty też znikną
        },
        nazwa: { type: 'varchar', notNull: true },
        quantity: { type: 'integer', notNull: true, default: 1 }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Funkcja down() pozwala cofnąć migrację, jeśli coś pójdzie nie tak.
    // Robimy dokładnie odwrotność tego, co w funkcji up().

    // 1. Usuwamy nowe tabele
    pgm.dropTable('product', { ifExists: true });
    pgm.dropTable('lista', { ifExists: true });

    // 2. Przywracamy starą tabelę 'products' (słownik)
    pgm.createTable('products', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'varchar', notNull: true, unique: true }
    });

    // 3. Przywracamy starą tabelę 'lists' (tabela łącząca)
    pgm.createTable('lists', {
        owner: { 
            type: 'integer', 
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE'
        },
        list: { type: 'integer', notNull: true },
        product: { 
            type: 'integer', 
            notNull: true,
            references: '"products"',
            onDelete: 'CASCADE'
        },
        quantity: { type: 'integer', notNull: true, default: 1 }
    });

    // 4. Przywracamy stary klucz główny
    pgm.addConstraint('lists', 'pk_lists', {
        primaryKey: ['owner', 'list', 'product']
    });
};