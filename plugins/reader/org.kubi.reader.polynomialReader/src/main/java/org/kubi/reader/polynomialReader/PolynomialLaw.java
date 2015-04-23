package org.kubi.reader.polynomialReader;


import java.util.LinkedList;
import java.util.List;

/**
 * Created by jerome on 19/03/15.
 */
public class PolynomialLaw {

    List<Double> coefficients;

    /**
     * create the PolynomialLaw. Each monomial has to be written even if it's 0
     *
     * @param doubles
     *            each coefficient of the polynomial sorting from the lower power
     *            to the higher one
     */
    public PolynomialLaw(final Double... doubles) {
        this.coefficients = new LinkedList<Double>();
        for (Double e : doubles) {
            this.coefficients.add(e);
        }
    }

    /**
     * Evaluate the law with the parameter n
     * evaluate f(n)
     */
    public Double evaluate(Double n) {
        double res = 0;
        double pow = 1;
        for (int i = 0; i < this.coefficients.size(); i++) {
            res += this.coefficients.get(i) * pow;
            pow *= n;
        }
        return res>0. ? res : 0;
    }

    /**
     * @return the coefficients
     */
    protected List<Double> getCoefficients() {
        return this.coefficients;
    }

    /**
     * Getter for the original ordonnee
     *
     * @return the original ordonnee
     */
    protected Double getOriginalOrdonee() {
        return this.coefficients.get(0);
    }
}