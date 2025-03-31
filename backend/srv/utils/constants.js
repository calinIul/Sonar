export default Object.freeze({
  CDS_ENTITIES: {
    Genres: 'stream.station.Genres',
    User: 'stream.station.User',
    Stations: 'stream.station.Stations',
    SavedStations: 'stream.station.SavedSations',
    StationGenres: 'stream.station.StationGenres',
    Songs: 'stream.station.Songs',
    SavedSongs: 'stream.station.SavedSongs',
  },
  CACHE_DURATION: 60 * 60 * 1000 * 24,
  API_URL: 'https://de1.api.radio-browser.info/json',
  AUDIO_URL: 'http://127.0.0.1:5000',
  METADATA_TOKEN:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiYzkzMDc2MGYzYjI1NWI2ZjBmNjhlZDgzZjAxYjU5NjE1ZDIyOGZjOWUyOWE3MTFhZWUzYmM0MWM2ZDEzYTU3MTMzYTIwNjA0Yzk3MTI5N2QiLCJpYXQiOjE3NDA2NTg1MTcuNzkyNjA0LCJuYmYiOjE3NDA2NTg1MTcuNzkyNjA3LCJleHAiOjIwNTYxOTEzMTcuNzMwNDM5LCJzdWIiOiIxOTM2MDEiLCJzY29wZXMiOlsibWV0YWRhdGEiLCJyZWFkLW1ldGFkYXRhIl19.diWGnBXTmzhTIT4ChMsfwKbQ02HggLbAArCyOliYlql2Ryn5-tTAnr5l4BgMq6i9ZICve_ODzmSsTaY3XUt92erk4J9W2NOb5-3oN1y53bPc9jmQS_c465-0XgFcDCctwbhNaLHWPNfBLviiEiwU0SMBOqciuE8dRkKvPO2lKS9XVD8c3gAmXqdMWHgONijfmgiBlE_rHb2D7UOI67xZN-LVfIASRSLAW0ULP3yG3UmzoHa7xha1jpPcI-Q2QBd4opo9pDi0V8VVXhcd54hIiLymhT43gA9SU17UYVw5Cw67DL1AjseFYREfQmlNfWpY6enB9sZB6vahOO63WSf56aEgOdHM22QfiLsNybsRbK3so0B1EEKtM358DIVYaT9kToKPaFcRIPBlhlRtX7BmRnsypWslAeWQujdyJJVuRNalEYKi6Rw_ArI35eUEw50uClMtgZM9kYwfwTc8ajMPmWUHt_sQh4dpc86iQmqKE53riJkfdaWPAir9BRCv53XAppG6e_J4xwBMSrpMkCgF9AOtcioyeVFz-lzX9BwZjeFx9_Fnqy-BosUlZzny_uDoKrZZz0VGtTBESyTH26R00-FnMX6orqvTMP7PVM5A04hV8-LcfDGXvHtWQFakBcm0ykKseSy9h-CrYHJxb2rzC0Smt-_vFnWlprGjqzMRuyQ',
  EMBEDDING_MODEL: {
    MODEL_NAME: 'text-embedding-ada-002',
    TOKEN_LIMIT: 8192,
    DIMENSION_LIMIT: 2048,
  },
});
