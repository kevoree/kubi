package org.kevoree.brain;


import edu.emory.mathcs.jtransforms.fft.DoubleFFT_1D;
import org.kevoree.brain.util.SortingMap;

import java.io.FileOutputStream;
import java.io.PrintStream;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

/**
 * Created by assaad on 08/04/15.
 */
public class JavaPeriodCalculatorFFT {

    private static void normalize(double [] results){
        int n = results.length;
        for (int j = 1; j < n; j++) {
            results[j]=results[j]/results[0];
        }
        results[0]=1;
    }

    private static void fftAutoCorrelation(double [] x, double [] ac) {
        int n = x.length;
        // Assumes n is even.
        DoubleFFT_1D fft = new DoubleFFT_1D(n);
        fft.realForward(x);
        ac[0] = x[0]*x[0];
        // ac[0] = 0;  // For statistical convention, zero out the mean
        ac[1] = x[1]*x[1];
        for (int i = 2; i < n; i += 2) {
            ac[i] = x[i]* x[i]+ x[i+1]*x[i+1];
            ac[i+1] = 0;
        }
        DoubleFFT_1D ifft = new DoubleFFT_1D(n);
        ifft.realInverse(ac, true);
    }

    private static void export(double [] results){
        try {
            String dir="/Users/assaad/work/github/data/fft/";
            PrintStream out = new PrintStream(new FileOutputStream(dir+"Test.csv"));
            for (int i = 0; i < results.length; i++) {
                out.println(i+" , "+results[i]);
            }
            out.close();
        }
        catch (Exception ex){
            ex.printStackTrace();
        }
    }

    public static int getPeriod(double[] entryTimeLine, int estimPerLow, int estimPerUp) {
        double [] ac = new double[entryTimeLine.length];
        double []x=new double[entryTimeLine.length];
        System.arraycopy(entryTimeLine,0,x,0,entryTimeLine.length);
        fftAutoCorrelation(x, ac);

        double max=0;
        int position=0;
        for(int i=estimPerLow;i<=estimPerUp;i++){
            if(ac[i]>=max){
                max=ac[i];
                position=i;
            }
        }

        return position;
    }


    public static SortedSet<Map.Entry<Integer, Double>> getAllPeriods(double[] entryTimeLine, int estimPerLow, int estimPerUp) {
        double [] ac = new double[entryTimeLine.length];

        double []x=new double[entryTimeLine.length];
        System.arraycopy(entryTimeLine,0,x,0,entryTimeLine.length);

        fftAutoCorrelation(x, ac);

        double total=0;
        for(int i=estimPerLow;i<estimPerUp;i++){
            total=total+ac[i];
        }


        int n=estimPerUp-estimPerLow+1;
        TreeMap<Integer, Double> resultsTreeMap =new TreeMap<Integer, Double>();
        for(int estimPer = estimPerLow; estimPer <= estimPerUp; estimPer++){
            double confidence=(ac[estimPer]/total*n-1)/(n-1);
            if(Double.isNaN(confidence)){
                confidence=0;
            }
            resultsTreeMap.put(estimPer,confidence);
        }

        return SortingMap.entriesSortedByValues(resultsTreeMap);

    }

    public static int getOtherPeriod(double[] entryTimeLine, int estimPerLow, int estimPerUp){
        SortedSet<Map.Entry<Integer, Double>> allresults = getAllPeriods(entryTimeLine, estimPerLow, estimPerUp);
        double nintyFivePerCent = 0.95;
        double maxValueThreshold = nintyFivePerCent * allresults.first().getValue();
        double maxKey   = allresults.first().getKey();
        SortedSet<Integer> res = new TreeSet<>();
        res.add((int) maxKey);
        for(Map.Entry<Integer, Double> unitRes: allresults){
            if(unitRes.getValue() > maxValueThreshold && Math.abs(unitRes.getKey()-maxKey) > 0.1*maxKey){
                // X in res => probability(X)>0.95*proba(Max)  && |X-Max|>0.1*Max
                res.add(unitRes.getKey());
            }
        }
        return res.first();
//        return getAllPeriods(entryTimeLine, estimPerLow, estimPerUp).toArray();
    }
}