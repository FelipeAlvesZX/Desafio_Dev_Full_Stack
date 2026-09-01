import { HttpInterceptorFn } from '@angular/common/http';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const jaAbsoluta = /^https?:\/\//i.test(req.url);
  const jaPrefixada = req.url.startsWith('/api/');

  if (jaAbsoluta || jaPrefixada) {
    return next(req);
  }

  const caminho = req.url.startsWith('/') ? req.url : `/${req.url}`;
  return next(req.clone({ url: `/api${caminho}` }));
};
