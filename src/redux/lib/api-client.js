import axios from 'axios';
import { omitBy, isUndefined, isNull } from 'lodash';
import store from 'store2';
import { STARTING_WITH_HTTPS_OR_HTTPS } from '../../utils/regexs';
import {
  validObjectWithParameterKeys,
  strictValidString,
} from '../../utils/common-utils';
import { messages } from '../../language';
import moment from 'moment';
const apiHost = process.env.REACT_APP_BASE_URL;

const methods = ['get', 'post', 'put', 'patch', 'delete'];

function formatUrl(path) {
  if (!path) {
    return path;
  }
  if (STARTING_WITH_HTTPS_OR_HTTPS.test(path)) {
    return path;
  }
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return `${apiHost}${adjustedPath}`;
}

class ApiClient {
  constructor(req) {
    methods.forEach((method) => {
      this[method] = this._req(method);
    });
  }

  _req =
    (method) =>
    (path, { params, data } = {}, crossBrowser = false) =>
      new Promise((resolve, reject) => {
        const apiObj = {
          method,
          url: formatUrl(path),
        };
        if (params) {
          const emptySting = (val) => val === '';
          const cleanFromUndefined = omitBy(params, isUndefined);
          const cleanFromNull = omitBy(cleanFromUndefined, isNull);
          const localParam = omitBy(cleanFromNull, emptySting);
          apiObj.params = localParam || {};
        }
        if (data) {
          apiObj.data = data;
        }
        const http = axios.create({
          headers: { 'Content-Type': 'application/json' },
        });
        http.interceptors.request.use(
          (config) => {
            if (!crossBrowser) {
              const token = store('authToken');
              const refreshToken = store('refreshToken');
              const timezone = moment.tz.guess();
              config.headers['timezone'] = timezone;
              // 	window.location.origin
              // config.headers['x-portal'] = 'Client';
              if (token) config.headers['authorization'] = token;
              if (refreshToken) config.headers.RefreshToken = refreshToken;
            }
            return config;
          },
          (error) => reject(error),
        );
        http(apiObj)
          .then((response) => {
            const newToken =
              validObjectWithParameterKeys(response, ['headers']) &&
              validObjectWithParameterKeys(response.headers, [
                'authorization',
              ]) &&
              response.headers['authorization'];
            if (newToken) {
              const user = {
                ...store.get('user'),
                token: newToken,
              };
              store({
                user,
                authToken: newToken,
              });
            }
            resolve(response.data);
          })
          .catch(async (error) => {
            // const originalConfig = error.config;
            const isValidErrorObject =
              validObjectWithParameterKeys(error, ['response']) &&
              validObjectWithParameterKeys(error.response, ['status', 'data']);

            if (isValidErrorObject) {
              const { data = {} } = error.response;
              const { message } = data;
              const token = store('authToken');
              if (error.response.status === 401 && token) {
                store.clearAll();
                if (window.confirm(messages.ERROR_MESSAGE)) {
                  window.location = '/login';
                }
              }
              if (strictValidString(message)) {
                reject(message);
              } else {
                reject(messages.DEFAULT_ERROR_MESSAGE);
              }
            } else if (strictValidString(error)) {
              reject(error);
            } else {
              reject(messages.DEFAULT_ERROR_MESSAGE);
            }
          });
      });
}
export default ApiClient;
