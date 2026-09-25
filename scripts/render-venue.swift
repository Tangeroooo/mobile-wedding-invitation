// macOS Core Graphics preserves the Korean fonts in the hotel-supplied PDF.
// Usage: swift scripts/render-venue.swift input.pdf output.png
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

guard CommandLine.arguments.count == 3,
      let pdf = CGPDFDocument(URL(fileURLWithPath: CommandLine.arguments[1]) as CFURL),
      let page = pdf.page(at: 1) else { fatalError("Provide a readable single-page venue PDF and a PNG output path.") }
let bounds = page.getBoxRect(.mediaBox)
let scale = 2200 / bounds.height
let width = Int(ceil(bounds.width * scale)), height = 2200
guard let context = CGContext(data: nil, width: width, height: height, bitsPerComponent: 8,
                              bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(),
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { fatalError("Cannot create image context.") }
context.setFillColor(CGColor(gray: 1, alpha: 1))
context.fill(CGRect(x: 0, y: 0, width: width, height: height))
context.scaleBy(x: scale, y: scale)
context.translateBy(x: -bounds.minX, y: -bounds.minY)
context.drawPDFPage(page)
guard let image = context.makeImage(),
      let output = CGImageDestinationCreateWithURL(URL(fileURLWithPath: CommandLine.arguments[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)
else { fatalError("Cannot write output image.") }
CGImageDestinationAddImage(output, image, nil)
guard CGImageDestinationFinalize(output) else { fatalError("PNG write failed.") }
print("Rendered \(width)x\(height)")
