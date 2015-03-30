package org.kubi.driver.mock.smartcampus;

/**
 * Created by jerome on 30/03/15.
 */
public class PolynomialParkingLaw extends PolynomialLaw {


    public PolynomialParkingLaw(final Double... doubles) {
        super(doubles);
    }


    @Override
    public Double evaluate(Double n) {
        // only the the case of a parking of a campus frequency
        if (n%24 > 18 || n%24<8 ){
            return 0.;
        }
        return super.evaluate(n);
    }
}
