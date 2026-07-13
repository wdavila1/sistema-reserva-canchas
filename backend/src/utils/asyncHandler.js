/** Envuelve un controlador async para que cualquier error caiga automáticamente
 * en error.middleware.js, sin necesidad de try/catch en cada controller. */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
