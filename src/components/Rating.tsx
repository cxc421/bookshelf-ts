/** @jsx jsx */
import {jsx, InterpolationWithTheme} from '@emotion/core';

import React, {FC} from 'react';
import {useMutation, queryCache} from 'react-query';
import {client} from 'utils/api-client';
import {FaStar} from 'react-icons/fa';
import * as colors from 'styles/colors';
import {User} from '../auth-provider';
import {ListItem} from 'types/listItemTypes';

const visuallyHiddenCSS: InterpolationWithTheme<any> = {
  border: '0',
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px',
};

type Props = {
  listItem: ListItem;
  user: User;
};

const Rating: FC<Props> = ({listItem, user}) => {
  const [isTabbing, setIsTabbing] = React.useState(false);

  type UpdateArgs = Partial<ListItem> & Pick<ListItem, 'id'>;
  const [updateListItem] = useMutation<any, Error, UpdateArgs>(
    ({id, rating}: UpdateArgs) =>
      client(`list-items/${id}`, {
        method: 'PUT',
        token: user.token,
        data: {rating},
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  );

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        setIsTabbing(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown, {once: true});
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rootClassName = `list-item-${listItem.id}`;

  const stars = Array.from({length: 5}).map((x, i) => {
    const ratingId = `rating-${listItem.id}-${i}`;
    const ratingValue = i + 1;
    return (
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          checked={ratingValue === listItem.rating}
          onChange={() => {
            updateListItem({id: listItem.id, rating: ratingValue});
          }}
          css={[
            visuallyHiddenCSS,
            {
              [`.${rootClassName} &:checked ~ label`]: {color: colors.gray20},
              [`.${rootClassName} &:checked + label`]: {color: 'orange'},
              // !important is here because we're doing special non-css-in-js things
              // and so we have to deal with specificity and cascade. But, I promise
              // this is better than trying to make this work with JavaScript.
              // So deal with it 😎
              [`.${rootClassName} &:hover ~ label`]: {
                color: `${colors.gray20} !important`,
              },
              [`.${rootClassName} &:hover + label`]: {
                color: 'orange !important',
              },
              [`.${rootClassName} &:focus + label svg`]: {
                outline: isTabbing
                  ? ['1px solid orange', '-webkit-focus-ring-color auto 5px']
                  : 'initial',
              },
            },
          ]}
        />
        <label
          htmlFor={ratingId}
          css={{
            cursor: 'pointer',
            color: listItem.rating < 0 ? colors.gray20 : 'orange',
            margin: 0,
          }}
        >
          <span css={visuallyHiddenCSS}>
            {ratingValue} {ratingValue === 1 ? 'star' : 'stars'}
          </span>
          <FaStar css={{width: '16px', margin: '0 2px'}} />
        </label>
      </React.Fragment>
    );
  });
  return (
    <div
      onClick={e => e.stopPropagation()}
      className={rootClassName}
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        [`&.${rootClassName}:hover input + label`]: {
          color: 'orange',
        },
      }}
    >
      <span css={{display: 'flex'}}>{stars}</span>
    </div>
  );
};

export {Rating};
