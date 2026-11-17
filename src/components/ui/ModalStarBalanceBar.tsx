import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ApiStarsAmount } from '../../api/types';

import { formatStarsAmount } from '../../global/helpers/payments';
import buildClassName from '../../util/buildClassName';
import { formatStarsAsIcon, NEXT_ARROW_REPLACEMENT } from '../../util/localization/format';

import useIsTopmostBalanceBarModal from '../../hooks/element/useIsTopmostBalanceBarModal';
import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';
import useShowTransition from '../../hooks/useShowTransition';

import Link from './Link';

import styles from './ModalStarBalanceBar.module.scss';

export type OwnProps = {
  isModalOpen?: true;
  currency?: 'TON' | 'XTR';
  onCloseAnimationEnd?: () => void;
};

export type StateProps = {
  starBalance?: ApiStarsAmount;
};

function ModalStarBalanceBar({
  starBalance,
  isModalOpen,
  currency,
  onCloseAnimationEnd,
}: StateProps & OwnProps) {
  const {
    openStarsBalanceModal,
  } = getActions();

  const lang = useLang();
  const isTonMode = currency === 'TON';
  const currentBalance = starBalance;
  const isOpen = isModalOpen ? Boolean(currentBalance) : false;

  const {
    ref,
    shouldRender,
  } = useShowTransition({
    isOpen,
    onCloseAnimationEnd,
    withShouldRender: true,
  });

  const isTopmost = useIsTopmostBalanceBarModal(ref, Boolean(shouldRender && currentBalance));

  const handleGetMoreStars = useLastCallback(() => {
    openStarsBalanceModal(isTonMode ? { currency: 'TON' } : {});
  });

  if (!shouldRender || !currentBalance) {
    return undefined;
  }

  return (
    <div
      className={buildClassName(styles.root, !isTopmost && styles.hidden)}
      ref={ref}
    >
      <div>
        { lang('ModalStarsBalanceBarDescription', {
          stars: formatStarsAsIcon(lang, formatStarsAmount(lang, currentBalance)),
        }, {
          withNodes: true,
          withMarkdown: true,
        })}
      </div>
      <div>
        <Link className={styles.getMoreStarsLink} isPrimary onClick={handleGetMoreStars}>
          {lang('GetMoreStarsLinkText', undefined, {
            withNodes: true,
            specialReplacement: NEXT_ARROW_REPLACEMENT,
          })}
        </Link>
      </div>
    </div>
  );
}

export default memo(withGlobal(
  (global): Complete<StateProps> => {
    const {
      stars,
    } = global;

    return {
      starBalance: stars?.balance,
    };
  },
)(ModalStarBalanceBar));
