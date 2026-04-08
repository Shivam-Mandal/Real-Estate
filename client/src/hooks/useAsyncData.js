import { useEffect, useState } from "react";

export const useAsyncData = (loader, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) {
        setLoading(true);
        setError(null);
      }
    });

    loader()
      .then((result) => {
        if (mounted) {
          setData(result);
        }
      })
      .catch((requestError) => {
        if (mounted) {
          setError(requestError);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [loader]);

  return { data, loading, error, setData };
};
