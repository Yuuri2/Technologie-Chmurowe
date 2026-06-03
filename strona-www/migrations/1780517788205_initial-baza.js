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
    // 1. Create Users Table
    pgm.createTable('users', {
        id: { type: 'integer', primaryKey: true },
        username: { type: 'varchar', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true }
    });

    // 2. Create Products Table
    pgm.createTable('products', {
        id: { type: 'integer', primaryKey: true },
        name: { type: 'varchar', notNull: true, unique: true }
    });

    // 3. Create Lists Table
    pgm.createTable('lists', {
        owner: { 
            type: 'integer', 
            notNull: true,
            references: '"users"', // Ref user_has_list
            onDelete: 'CASCADE'
        },
        list: { type: 'integer', notNull: true },
        product: { 
            type: 'integer', 
            notNull: true,
            references: '"products"', // Ref product_on_many_lists
            onDelete: 'CASCADE'
        },
        quantity: { type: 'integer', notNull: true, default: 1 }
    });

    // 4. Create the Composite Primary Key for Lists
    pgm.addConstraint('lists', 'pk_lists', {
        primaryKey: ['owner', 'list', 'product']
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Drop in reverse order to respect foreign key constraints
  pgm.dropTable('lists', { ifExists: true });
  pgm.dropTable('products', { ifExists: true });
  pgm.dropTable('users', { ifExists: true });
};
