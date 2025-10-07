/**
 * @fileoverview Validation Helper - Validazione input semplificata
 * @principle KISS - Funzioni di validazione chiare e riutilizzabili
 * @principle DRY - Validatori comuni per tutti i servizi
 */

/**
 * Valida che i campi richiesti siano presenti
 */
export function validateRequired(data: Record<string, any>, fields: string[]): string[] {
  const missing: string[] = [];
  
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }
  
  return missing;
}

/**
 * Valida formato email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida lunghezza stringa
 */
export function validateLength(value: string, min: number, max?: number): boolean {
  const len = value.length;
  if (len < min) return false;
  if (max && len > max) return false;
  return true;
}

/**
 * Valida che il valore sia in un set di opzioni
 */
export function validateEnum<T extends string>(value: T, options: T[]): boolean {
  return options.includes(value);
}

/**
 * Sanitizza input rimuovendo caratteri pericolosi
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Rimuove < e >
    .slice(0, 1000); // Limita lunghezza
}

/**
 * Valida ID univoco (UUID o simili)
 */
export function validateId(id: string): boolean {
  // Accetta UUID v4 o stringhe alfanumeriche di 16-36 caratteri
  const idRegex = /^[a-zA-Z0-9-_]{16,36}$/;
  return idRegex.test(id);
}

/**
 * Helper: crea messaggio errore validazione
 */
export function validationError(field: string, message: string): { field: string; message: string } {
  return { field, message };
}
