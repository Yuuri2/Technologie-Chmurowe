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
    // 1. Włączenie rozszerzenia pgcrypto (jeśli nie istnieje)
    pgm.sql(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // 2. Stworzenie funkcji hashującej przed zapisem
    pgm.sql(`
        CREATE OR REPLACE FUNCTION hash_user_password()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.password IS NOT NULL AND NEW.password <> '' THEN
                NEW.password := crypt(NEW.password, gen_salt('bf', 10));
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // 3. Powiązanie funkcji z tabelą użytkowników za pomocą Triggera
    // Wyzwalacz zadziała przy KAŻDYM nowym insercie do tabeli 'users'
    pgm.sql(`
        CREATE TRIGGER trigger_hash_password
        BEFORE INSERT ON "users"
        FOR EACH ROW
        EXECUTE FUNCTION hash_user_password();
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // Usuwanie w odwrotnej kolejności
    pgm.sql(`DROP TRIGGER IF EXISTS trigger_hash_password ON "users";`);
    pgm.sql(`DROP FUNCTION IF EXISTS hash_user_password();`);
    // Zazwyczaj nie usuwa się samego rozszerzenia pgcrypto w sekcji down, 
    // ponieważ inne tabele lub funkcje mogą z niego korzystać.
};