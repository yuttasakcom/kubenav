import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';

import { sections } from '../../sections';
import { Context } from '../../declarations';
import { AppContext } from '../../context';

interface ListProps {
  name: string;
  section: string;
  type: string;
  namespace: string;
  selector?: string;
  filter?: (item: any) => boolean;
}

const List: React.FunctionComponent<ListProps> = ({ name, section, type, namespace, selector, filter }) => {
  const context = useContext<Context>(AppContext);

  const page = sections[section].pages[type];
  const Component = page.listItemComponent;

  const [alert, setAlert] = useState<string>('');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [items, setItems] = useState<any>();

  useEffect(() => {
    (async() => {
      setItems(undefined);
      await load();
    })();

    return () => {};
  }, [section, type, namespace, selector, filter]); /* eslint-disable-line */

  const load = async () => {
    setShowLoading(true);

    try {
      const data: any = await context.request('GET', `${page.listURL(namespace) }${selector ? '?' + selector : ''}`, '');
      setItems(data.items);
    } catch (err) {
      setAlert(err);
    }

    setShowLoading(false);
  };

  if (items && items.filter(filter ? filter : () => true).length > 0) {
    return (
      <IonCol>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {showLoading ? <IonItem>
                <IonSpinner slot="end" />
                <IonLabel>Loading...</IonLabel>
              </IonItem> : null}

              {alert !== '' ? <IonItem>
                <IonLabel>Could not load {page.pluralText}</IonLabel>
              </IonItem> : null}

              {items.filter(filter ? filter : () => true).map((item, index) => {
                return (
                  <Component key={index} item={item} section={section} type={type} />
                )
              })}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonCol>
    )
  } else {
    return (
      <React.Fragment />
    )
  }
};

export default List;