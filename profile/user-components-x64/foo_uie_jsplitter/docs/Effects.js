/**
 * Direct2D effects<br>
 * Minimum system requirements: Windows 7 Platform Update (Direct2D 1.1)<br>
 * Not all effects in this module supported by minimum Direct2D version.
 * @module Effects
 * @example
 * window.DrawMode = 1;
 * 
 * include(`${fb.ComponentPath}\\docs\\Effects.js`);
 * 
 * const img = d2d.Image(`${fb.ProfilePath}\\images\\Flowers.jpg`);
 * 
 * const effect = d2d.Effect(Effects.Sepia.ID);
 * effect.SetInput(0, img);
 * effect.SetValue(Effects.Sepia.Intensity, 0.5);
 * 
 * function on_paint(dgr) {	
 *     dgr.DrawEffect(effect, 10, 10, 0, 0, img.Width, img.Height);
 * }
 * 
 * @example
 * window.DrawMode = 1;
 * 
 * include(`${fb.ComponentPath}\\docs\\Effects.js`);
 * 
 * const img = d2d.Image(`${fb.ProfilePath}\\images\\Flowers.jpg`);
 * 
 * const sepia = d2d.Effect(Effects.Sepia.ID);
 * sepia.SetInput(0, img);
 * sepia.SetValue(Effects.Sepia.Intensity, 0.5);
 *
 * const contrast = d2d.Effect(Effects.Contrast.ID);
 * contrast.SetInputEffect(0, sepia);
 * contrast.SetValue(Effects.Contrast.Contrast, 1.0);
 *
 * const scale = d2d.Effect(Effects.Scale.ID);
 * scale.SetInputEffect(0, contrast);
 * scale.SetValue(Effects.Scale.Scale, [0.7, 0.7]);
 * 
 * function on_paint(dgr) {	
 *     dgr.DrawEffect(scale, 10, 10, 0, 0, img.Width, img.Height);
 * }
 * 
 * @example
 * include(`${fb.ComponentPath}\\docs\\Effects.js`);
 * 
 * window.DrawMode = 1;
 * 
 * const shaderSource = `
 *     // Input texture (Direct2D passed it into t0)
 *     Texture2D InputTexture : register(t0);
 *     SamplerState InputSampler : register(s0);
 * 
 *     // Direct2D input data structure
 *     struct VS_OUTPUT {
 *         float4 clipSpacePos : SV_POSITION;
 *         float4 sceneSpacePos : SCENE_POS;
 *         float4 texelSpacePos : TEXEL_POS;
 *     };
 * 
 *     // Simple color inversion shader
 *     float4 main(VS_OUTPUT input) : SV_Target
 *     {
 *         // Selecting a pixel from an input image
 *         float4 color = InputTexture.Sample(InputSampler, input.texelSpacePos.xy);
 * 	
 *         // Invert RGB, keep alpha
 *         return float4(1.0 - color.rgb, color.a) * color.a;
 *     }
 * `;
 * 
 * const shaderCode = d2d.Compile(shaderSource);
 * 
 * const img = d2d.Image('Flowers.jpg');
 * const effect = d2d.Effect(Effects.CustomShader.ID);
 * effect.SetInput(0, img);
 * if (shaderCode.Error !== "") 
 *     fb.ShowPopupMessage(code.Error, "Direct2D compile error!");
 * else
 *     effect.SetValue(Effects.CustomShader.ShaderCode, shaderCode.Code);
 * 
 * function on_paint(dgr) {	
 *     dgr.DrawEffect(effect, 10, 10, 0, 0, img.Width, img.Height);
 * }
 */

/** 
 * @typedef {Object} Effects
 * @memberof module:Effects
 * 
 * @property {Object} CustomShader
 * Applies custom shader to image.<br> 
 * @property {string} CustomShader.ID
 * CLSID of effect.
 * @property {number} CustomShader.ShaderCode
 * Value type: <b>ARRAY (code bytes blob)</b><br>
 * Compiled shader bytecode. Shader MUST be compiled before setting it as an input value for this effect.<br>
 * Use {@link d2d.Compile} to compile shader source code (see example in the page end).<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-writing-shaders-9}
 * 
 * @property {Object} Brightness
 * Use the brightness effect to control the brightness of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/brightness}
 * @property {string} Brightness.ID
 * CLSID of effect.
 * @property {number} Brightness.WhitePoint
 * Value type: <b>ARRAY [1.0, 1.0]</b><br>
 * The upper portion of the brightness transfer curve.<br>
 * The white point adjusts the appearance of the brighter portions of the image.<br>
 * This property is for both the x value and the y value, in that order.<br>
 * Each of the values of this property are between 0 and 1, inclusive.
 * @property {number} Brightness.BlackPoint
 * Value type: <b>ARRAY [0.0, 0.0]</b><br>
 * The lower portion of the brightness transfer curve.<br>
 * The black point adjusts the appearance of the darker portions of the image.<br>
 * This property is for both the x value and the y value, in that order.<br>
 * Each of the values of this property are between 0 and 1, inclusive.
 * 
 * @property {Object} Contrast
 * Increases or decreases the contrast of an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/contrast-effect}
 * @property {string} Contrast.ID
 * CLSID of effect.
 * @property {number} Contrast.Contrast
 * Value type: <b>FLOAT</b><br>
 * Value indicating the amount by which to adjust the contrast of the image.<br>
 * Negative values reduce contrast, while positive values increase contrast.<br>
 * Minimum value is -1.0, maximum value is 1.0. The default value for the property is 0.0.
 * @property {number} Contrast.ClampInput
 * Value type: <b>BOOL</b><br>
 * Value indicating whether or not to clamp the input to [0.0, 1.0].<br>
 * The default value for the property is FALSE.     
 * 
 * @property {Object} Scale
 * Increases or decreases the contrast of an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/high-quality-scale}
 * @property {string} Scale.ID
 * CLSID of effect.
 * @property {number} Scale.Scale
 * Value type: <b>ARRAY [1.0, 1.0]</b><br>
 * The scale amount in the X and Y direction as a ratio of the output size to the input size.<br>
 * This property an array defined as: (X scale, Y scale). The scale amounts are FLOAT, unitless, and must be positive or 0.<br>
 * The default value is [1.0, 1.0].
 * @property {number} Scale.CenterPoint
 * Value type: <b>ARRAY [0.0, 0.0]</b><br>
 * The image scaling center point. This property is an array defined as: (point X, point Y).<br>
 * Use the center point property to scale around a point other than the upper-left corner.<br>
 * The default value is [0.0, 0.0].
 * @property {number} Scale.InterpolationMode
 * Value type: <b>{@link module:Effects.ScaleInterpolationMode ScaleInterpolationMode}</b><br>
 * The interpolation mode the effect uses to scale the image. There are 6 scale modes that range in quality and speed. See Interpolation modes for more info.<br>
 * The default value is {@link module:Effects.ScaleInterpolationMode ScaleInterpolationMode.Linear}
 * @property {number} Scale.BorderMode
 * Value type: <b>{@link module:Effects.ScaleBorderMode ScaleBorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.ScaleBorderMode ScaleBorderMode.Soft}
 * 
 * @property {Object} GaussianBlur
 * Use the Gaussian blur effect to create a blur based on the Gaussian function over the entire input image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/gaussian-blur}
 * @property {string} GaussianBlur.ID
 * CLSID of effect.
 * @property {number} GaussianBlur.StandardDeviation
 * Value type: <b>FLOAT</b><br>
 * The amount of blur to be applied to the image. You can compute the blur radius of the kernel by multiplying the standard deviation by 3.<br>
 * The units of both the standard deviation and blur radius are DIPs. A value of zero DIPs disables this effect entirely.<br>
 * The default value is 3.0.
 * @property {number} GaussianBlur.Optimization
 * Value type: <b>{@link module:Effects.GaussianBlurOptimization GaussianBlurOptimization}</b><br>
 * The optimization mode. See Optimization modes for more info. The type is D2D1_GAUSSIANBLUR_OPTIMIZATION.
 * The default value is  {@link module:Effects.GaussianBlurOptimization GaussianBlurOptimization.Balanced}
 * @property {number} GaussianBlur.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * 
 * @property {Object} Exposure
 * Increase or decreases the exposure of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/exposure-effect}
 * @property {string} Exposure.ID
 * CLSID of effect.
 * @property {number} Exposure.ExposureValue
 * Value type: <b>FLOAT</b><br>
 * Specifies how much to increase or decrease the exposure of the image. The allowed range is -2.0 to 2.0. The default value is 0.0 (no change).
 * 
 * @property {Object} Sepia
 * Increase or decreases the exposure of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/sepia-effect}
 * @property {string} Sepia.ID
 * CLSID of effect.
 * @property {number} Sepia.Intensity
 * Value type: <b>FLOAT</b><br>
 * Value indicating the intensity of the sepia effect. The allowed range is 0.0 to 1.0.<br>
 * The default value is 0.5.
 * @property {number} Sepia.AlphaMode
 * Value type: <b>{@link module:Effects.AlphaMode AlphaMode}</b><br>
 * enumeration value indicating the alpha mode of the input file.<br>
 * The default value is {@link module:Effects.AlphaMode AlphaMode.Premultiplied}
 * 
 * @property {Object} Grayscale
 * Converts an image to monochromatic gray.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/grayscale-effect}
 * @property {string} Grayscale.ID
 * CLSID of effect.
 */

/**
 * Contains identifiers of built-in Direct2D effects with their CLSIDs and tuning properties.
 * @memberof module:Effects
 * @default
 */
const Effects = {

    CustomShader: {
        ID: '{fd4e017c-d9a4-4fb1-ae38-031e3b9cd97e}',
        ShaderCode: 0,
    },

    Brightness: {
        ID: '{8cea8d1e-77b0-4986-b3b9-2f0c0eae7887}',
        WhitePoint: 0,
        BlackPoint: 1,
    },
    
    Contrast: {
        ID: '{b648a78a-0ed5-4f80-a94a-8e825aca6b77}',
        Contrast: 0,
        ClampInput: 1,
    },
    
    Scale: {
        ID: '{9daf9369-3846-4d0e-a44e-0c607934a5d7}',
        Scale: 0,
        CenterPoint: 1,
        InterpolationMode: 2,
        BorderMode: 3,
        Sharpness: 4,
    },    
    
    GaussianBlur: {
        ID: '{1feb6d69-2fe6-4ac9-8c58-1d7f93e7a6a5}',
        StandardDeviation: 0,
        Optimization: 1,
        BorderMode: 2,
    },   
    
    Exposure: {
        ID: '{b56c8cfa-f634-41ee-bee0-ffa617106004}',
        ExposureValue: 0,
    },

    Grayscale: {
        ID: '{36DDE0EB-3725-42E0-836D-52FB20AEE644}'
    },
    
    Sepia: {
        ID: '{3a1af410-5f1d-4dbe-84df-915da79b7153}',
        Intensity: 0,
        AlphaMode: 1,
    }
};

/**
 * Specifies the types of properties supported by the Direct2D property interface.<br>
 * Used as return type of {@link D2DEffect#GetPropertyType GetPropertyType}<br>
 * @memberof module:Effects
 * @default
 */
const D2DEffectPropertyType = {
    Unknown: 0,
    String: 1,
    Bool: 2,
    Uint32: 3,
    Int32: 4,
    Float: 5,
    Vector2: 6,
    Vector3: 7,
    Vector4: 8,
    Blob: 9,
    IUnknown: 10,
    Enum: 11,
    Array: 12,
    CLSID: 13,
    Matrix3x2: 14,
    Matrix4x3: 15,
    Matrix4x4: 16,
    Matrix5x4: 17,
    ColorContext: 18
};

/**
 * Used in {@link module:Effects.Effects Effects.Scale}<br>
 * <b>NearestNeighbor</b>: Samples the nearest single point and uses that. This mode uses less processing time, but outputs the lowest quality image.<br>
 * <b>Linear</b>: Uses a four point sample and linear interpolation. This mode uses more processing time than the nearest neighbor mode, but outputs a higher quality image.<br>
 * <b>Cubic</b>: Uses a 16 sample cubic kernel for interpolation. This mode uses the most processing time, but outputs a higher quality image.<br>
 * <b>MultiSampleLinear</b>: Uses 4 linear samples within a single pixel for good edge anti-aliasing. This mode is good for scaling down by small amounts on images with few pixels.<br>
 * <b>Anisotropic</b>: Uses anisotropic filtering to sample a pattern according to the transformed shape of the bitmap.<br>
 * <b>HighQualityCubic</b>: Uses a variable size high quality cubic kernel to perform a pre-downscale the image if downscaling is involved in the transform matrix. Then uses the cubic interpolation mode for the final output.<br>
 * @memberof module:Effects
 * @default
 */
const ScaleInterpolationMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultiSampleLinear: 3,
    Anisotropic: 4,
    HighQualityCubic: 5
};

/**
 * Used in {@link module:Effects.Effects Effects.Scale} and {@link module:Effects.Effects Effects.GaussianBlur}<br>
 * <b>Soft</b>: The effect pads the input image with transparent black pixels for samples outside of the input bounds when it applies the convolution kernel. This creates a soft edge for the image, and in the process expands the output bitmap by the size of the kernel.<br>
 * <b>Hard</b>: The effect extends the input image with a mirror-type border transform for samples outside of the input bounds. The size of the output bitmap is equal to the size of the input bitmap.
 * @memberof module:Effects
 * @default
 */
const BorderMode = {
    Soft: 0,
    Hard: 1
};

/**
 * Used in {@link module:Effects.Effects Effects.GaussianBlur}<br>
 * <b>Speed</b>: Applies internal optimizations such as pre-scaling at relatively small radii. Uses linear filtering.<br>
 * <b>Balanced</b>: Uses the same optimization thresholds as Speed mode, but uses trilinear filtering.<br>
 * <b>Quality</b>: Only uses internal optimizations with large blur radii, where approximations are less likely to be visible. Uses trilinear filtering.
 * @memberof module:Effects
 * @default
 */
const GaussianBlurOptimization = {
    Speed: 0,
    Balanced: 1,
    Quality: 2
};

/**
 * Used in {@link module:Effects.Sepia Effects.Sepia}<br>
 * <b>Unknown</b>: The alpha value might not be meaningful.<br>
 * <b>Premultiplied</b>: The alpha value has been premultiplied. Each color is first scaled by the alpha value. The alpha value itself is the same in both straight and premultiplied alpha. Typically, no color channel value is greater than the alpha channel value. If a color channel value in a premultiplied format is greater than the alpha channel, the standard source-over blending math results in an additive blend.<br>
 * <b>Straight</b>: The alpha value has not been premultiplied. The alpha channel indicates the transparency of the color.<br>
 * <b>Ignore</b>: The alpha value is ignored.
 * @memberof module:Effects
 * @default
 */
const AlphaMode = {
    Unknown: 0,
    Premultiplied: 1,
    Straight: 2,
    Ignore: 3,
};
