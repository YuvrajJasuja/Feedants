import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  currentStep: number;
}

export const StepIndicator: React.FC<Props> = ({ currentStep }) => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsRow}>
        <View style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, currentStep >= 1 && styles.stepNumActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, currentStep >= 2 && styles.stepNumActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />
        <View style={[styles.stepDot, currentStep >= 3 && styles.stepDotActive]}>
          <Text style={[styles.stepNum, currentStep >= 3 && styles.stepNumActive]}>3</Text>
        </View>
      </View>

      <View style={styles.labelsRow}>
        <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>1. Select Media</Text>
        <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>2. Details</Text>
        <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>3. Review</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#090D10',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E242B',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  stepDotActive: {
    backgroundColor: '#D4A446',
    borderColor: '#D4A446',
  },
  stepNum: {
    color: '#706C64',
    fontSize: 12,
    fontWeight: '700',
  },
  stepNumActive: {
    color: '#080B0D',
  },
  stepLine: {
    width: 44,
    height: 2,
    backgroundColor: '#1E242B',
  },
  stepLineActive: {
    backgroundColor: '#D4A446',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginTop: 6,
  },
  stepLabel: {
    color: '#706C64',
    fontSize: 11,
  },
  stepLabelActive: {
    color: '#E6C36E',
    fontWeight: '700',
  },
});

export default StepIndicator;
