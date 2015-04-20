package org.kubi.driver.mock.smartcampus;

import org.kubi.api.KubiKernel;
import org.kubi.api.KubiPlugin;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 20/03/15.
 */
public class SmartCampusPlugin implements KubiPlugin, Runnable {

    ScheduledExecutorService service = null;

    @Override
    public void start(KubiKernel kernel) {
        System.out.println("SmartCampus Start ... ");
        service = Executors.newScheduledThreadPool(1);
        service.scheduleAtFixedRate(this, 0, 5, TimeUnit.SECONDS);
    }

    @Override
    public void stop() {
        System.out.println("SmartCampus Stop ... ");
    }

    @Override
    public void run() {

    }
}
