import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { PortalProps } from '../../utils/types';
import { useCloseOnClickOutside } from '../../utils/hooks';

import styles from '../../styles/Portal.module.css';

// using React Portals to create my own dialog/modal HOC
// see: https://react.dev/reference/react-dom/createPortal
export const usePortal = <P extends {} & PortalProps>(WrappedComponent: React.ComponentType<P & PortalProps>) => {
  const Wrapper = (props: P & PortalProps) => {

    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // runs after the DOM is ready, similar to componentDidMount in class components 
        setModalRoot(document.body); // document.getElementById('modal-root')); // for this, add modal-root div to index.html under root 
    }, []);

    const modalContentRef = useCloseOnClickOutside<HTMLDivElement>(props.onClosePortal);

    if (!modalRoot) return null;

    return createPortal(
        <div className={styles.modalOverlay}>
            <div 
                className={styles.modalContent}
                ref={modalContentRef}
            > 
                <WrappedComponent {...props} />
            </div>
        </div>,
        modalRoot 
    );
  };
  return Wrapper;
};
