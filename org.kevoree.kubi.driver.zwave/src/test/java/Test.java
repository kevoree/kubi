import org.kevoree.kubi.driver.zwave.cmp.ZWaveDriver;
import org.kevoree.log.Log;

/**
 * Created with IntelliJ IDEA.
 * User: gregory.nain
 * Date: 21/11/2013
 * Time: 19:24
 * To change this template use File | Settings | File Templates.
 */
public class Test {


    public static void main(String[] args) {

        Log.TRACE();

        System.out.println("Creating Driver");
        ZWaveDriver driver = new ZWaveDriver();
        Log.debug("Driver created. Starting Component");
        driver.startComponent();

        Log.debug("Driver created. Starting Component");
    }


}
