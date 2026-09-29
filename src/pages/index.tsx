import {useEffect, type ReactNode} from 'react';

/// throw to a new page
export default function Home(): ReactNode {
  useEffect(() => {
    window.location.href = "/docs/welcome";
  });

  return <></>;
}
