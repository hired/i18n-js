# frozen_string_literal: true
module I18n
  module JS
    class DependencyResolver
      class << self
        attr_accessor :cache
      end

      attr_reader :files
      attr_reader :cache_file
      attr_reader :values

      def initialize(files, values, cache_file = Rails.root.join("tmp/cache/i18njs-digest.cache"))
        @files = files
        @values = values
        @cache_file = cache_file

        write_cache(SecureRandom.hex) unless cache_file.exist?
      end

      def read_cache
        return self.class.cache if self.class.cache

        digest, timestamp = cache_file.read.split(":")
        cache = [digest, timestamp.to_i]
        self.class.cache = cache

        cache
      end

      def write_cache(digest, expires_at = Time.now.to_i + 5.seconds)
        cache = [digest, expires_at]
        changed = self.class.cache != cache
        self.class.cache = cache

        cache_file.open("w") do |file|
          file << "#{digest}:#{expires_at}"
        end if changed
      end

      def digest
        now = Time.now.to_i
        digest, expires_at = read_cache

        if expires_at < now
          compute_digest.tap {|d| write_cache(d) }
        else
          digest
        end
      end

      def compute_digest
        Digest::MD5.hexdigest("#{files_digest}#{values_digest}")
      end

      def values_digest
        values
          .sort
          .join(":")
      end

      def files_digest
        files
          .sort
          .map {|file| "#{file}-#{File.mtime(file).to_i}" }
          .join(":")
      end
    end
  end
end
