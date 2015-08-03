package org.kubi.plugins.smartfridgerepeatrealtime.brain;


import org.apache.commons.math3.stat.correlation.PearsonsCorrelation;
import org.kubi.plugins.smartfridgerepeatrealtime.brain.util.SortingMap;

import java.util.Map;
import java.util.SortedSet;
import java.util.TreeMap;


/**
 * Created by assaad on 08/04/15.
 */
public class JavaPeriodCalculatorPearson {


    private static double sumItupDouble(double[] dataInput, int estimatedPer, int offset) {
        double sum = 0;
        for (int i = 0; i < dataInput.length; i++) {
            if (i % estimatedPer == offset) {
                sum = sum + dataInput[i];
            }
        }
        return sum;
    }

    private static double getPearsonDouble(double[] partOfOriginal, double[] componentPeriod) {
        PearsonsCorrelation pearsonCorr = new PearsonsCorrelation();
        return pearsonCorr.correlation(partOfOriginal, componentPeriod);
    }

    private static double getAverageFromList (double[] entryArrayList) {
        double sum = 0;
        for (int i = 0; i <entryArrayList.length;i++) {
            sum = sum + entryArrayList[i];
        }
        return sum/entryArrayList.length;
    }


    public static int getPeriod(double[] entryTimeLine, int estimPerLow, int estimPerUp) {

        //this value is used to compute the confidence at the end
        double sumPearsonCorr = 0;

        int max=0;
        double value=-1;



        for(int estimPer = estimPerLow; estimPer <= estimPerUp; estimPer++){
            double[] sumResults = new double[estimPer];

            for(int offSet = 0; offSet <= estimPer-1; offSet++){
                double currentSum = sumItupDouble(entryTimeLine, estimPer, offSet);
                sumResults[offSet]=currentSum;
            }

            //now we got the sums for one estimated period (this is called component with length sumResults.length()), now compare this componends with parts of the origninal curve

            int numberOfSwaps = entryTimeLine.length/sumResults.length;
            int offset = 0;
            double[] pearson = new double[numberOfSwaps];
            for(int swap = 0; swap < numberOfSwaps; swap++) {

                //now cut parts from the current observation and correlate it with the component
                double[] currentOrigComponent = new double[sumResults.length];
                for (int iii=0; iii<sumResults.length; iii++) {
                    currentOrigComponent[iii]=entryTimeLine[iii+offset];
                }
                offset = offset + sumResults.length;
                pearson[swap]=getPearsonDouble(currentOrigComponent, sumResults);
            }

            //now all parts of the observation curve have been correlated with the component
            //now we have to get the average of the pearson correlations
            double avgPearson = getAverageFromList(pearson);
            if(avgPearson>value){
                value=avgPearson;
                max=estimPer;
            }

        }
        return max;
    }


    public static SortedSet<Map.Entry<Integer, Double>> getAllPeriods(double[] entryTimeLine, int estimPerLow, int estimPerUp) {

        //this value is used to compute the confidence at the end
        double sumPearsonCorr = 0;


        int n=estimPerUp-estimPerLow+1;
        double[] results =new double[n];


        for(int estimPer = estimPerLow; estimPer <= estimPerUp; estimPer++){
            double[] sumResults = new double[estimPer];

            for(int offSet = 0; offSet <= estimPer-1; offSet++){
                double currentSum = sumItupDouble(entryTimeLine, estimPer, offSet);
                sumResults[offSet]=currentSum;
            }

            //now we got the sums for one estimated period (this is called component with length sumResults.length()), now compare this componends with parts of the origninal curve

            int numberOfSwaps = entryTimeLine.length/sumResults.length;
            int offset = 0;
            double[] pearson = new double[numberOfSwaps];
            for(int swap = 0; swap < numberOfSwaps; swap++) {

                //now cut parts from the current observation and correlate it with the component
                double[] currentOrigComponent = new double[sumResults.length];
                for (int iii=0; iii<sumResults.length; iii++) {
                    currentOrigComponent[iii]=entryTimeLine[iii+offset];
                }
                offset = offset + sumResults.length;
                pearson[swap]=getPearsonDouble(currentOrigComponent, sumResults);
            }

            //now all parts of the observation curve have been correlated with the component
            //now we have to get the average of the pearson correlations
            double avgPearson = getAverageFromList(pearson);

            results[estimPer-estimPerLow]=avgPearson;

            sumPearsonCorr = sumPearsonCorr + avgPearson;
//					System.out.println("putted in hashMap = " + jaPerCalc.getAverageFromArrayList(pearson));

        }

        //This is the correlation measure: >0 means more than random selection (we are confident about it as a period),
        // <0 means that less than random. we are confident that it is not a period.
        // Here we can filter if confidence>=0 add it to the tree, otherwise forget about it
        TreeMap<Integer, Double> resultsTreeMap =new TreeMap<Integer, Double>();
        for(int estimPer = estimPerLow; estimPer <= estimPerUp; estimPer++){
            double confidence=(results[estimPer-estimPerLow]/sumPearsonCorr*n-1)/(n-1);
            if(Double.isNaN(confidence)){
                confidence=0;
            }
            resultsTreeMap.put(estimPer,confidence);
        }

        return SortingMap.entriesSortedByValues(resultsTreeMap);
    }



}
