export const STRING_EMPTY = 'string.empty';
export const ANY_REQUIRED = 'any.required';
export const ALL_FIELDS_MUST_BE_FILLED = 'All fields must be filled';
export const superSecret: string = process.env.JWT_SECRET || 'jwt-super-secret-94074';
export const validTokenForTests = process.env.VALID_TOKEN_FOR_TESTS || '';
