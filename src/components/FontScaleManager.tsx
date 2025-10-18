import {useEffect} from 'react';
import {Text} from 'react-native';
import {useAppContext} from '../context/AppContext';

const FontScaleManager: React.FC = () => {
  const {
    state: {fontScale},
  } = useAppContext();

  useEffect(() => {
    const previous = Text.defaultProps || {};
    Text.defaultProps = {
      ...previous,
      allowFontScaling: true,
      maxFontSizeMultiplier: fontScale,
    };
    return () => {
      Text.defaultProps = previous;
    };
  }, [fontScale]);

  return null;
};

export default FontScaleManager;
