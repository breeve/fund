import Foundation

class LocalStorage {
    static let shared = LocalStorage()

    private let fileManager = FileManager.default
    private let dataDirectory: URL

    private init() {
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        dataDirectory = appSupport.appendingPathComponent("FundMac", isDirectory: true)

        if !fileManager.fileExists(atPath: dataDirectory.path) {
            try? fileManager.createDirectory(at: dataDirectory, withIntermediateDirectories: true)
        }
    }

    func load<T: Decodable>(_ type: T.Type, from file: String) -> T? {
        let url = dataDirectory.appendingPathComponent(file)
        guard let data = try? Data(contentsOf: url) else { return nil }
        return try? JSONDecoder().decode(T.self, from: data)
    }

    func save<T: Encodable>(_ value: T, to file: String) {
        let url = dataDirectory.appendingPathComponent(file)
        guard let data = try? JSONEncoder().encode(value) else { return }
        try? data.write(to: url, options: .atomic)
    }

    func exportPath() -> URL {
        return dataDirectory
    }
}
