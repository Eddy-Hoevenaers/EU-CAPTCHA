package com.sii.eucaptcha.captcha.audio.noise.impl;

import com.sii.eucaptcha.captcha.audio.Mixer;
import com.sii.eucaptcha.captcha.audio.Sample;
import com.sii.eucaptcha.captcha.audio.noise.NoiseProducer;
import com.sii.eucaptcha.captcha.util.FileUtil;
import com.sii.eucaptcha.configuration.properties.SoundConfigProperties;
import com.sii.eucaptcha.security.CaptchaRandom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;

/**
 * @author mousab.aidoud
 * @version 1.0
 */
public class EuCaptchaNoiseProducer implements NoiseProducer {

    private static final SecureRandom RANDOM = CaptchaRandom.getSecureInstance();

    private final String[] noises;
    private final Double sampleVolume;
    private final Double noiseVolume;

    /**
     * @param noiseFiles the noises to be mixed in the background of the spoken Captcha
     */
    public EuCaptchaNoiseProducer(String[] noiseFiles, Double sampleVolume, Double noiseVolume) {
        this.noises = noiseFiles;
        this.sampleVolume = sampleVolume;
        this.noiseVolume = noiseVolume;
    }

    /**
     * Handling the volume of the captcha audio and the volume of the noises
     * @param noiseSamples the audio files to generate the spoken Captcha
     * @return audio mixed with noise
     */
    @Override
    public Sample produceNoise(List<Sample> noiseSamples) {
        Sample appended = Mixer.append(noiseSamples);
        String noiseFile = this.noises[RANDOM.nextInt(this.noises.length)];
        Sample noise = FileUtil.readSample(noiseFile);
        return Mixer.mix(appended, sampleVolume, noise, noiseVolume);
    }

    /**
     * @return to String
     */
    public String toString() {
        return "[Noise files: " +
                Arrays.toString(this.noises) +
                "]";
    }
}

